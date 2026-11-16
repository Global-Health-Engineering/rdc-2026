# Builds talk/shared/data.json, the one source of every number on the slides.
# Reads the ghedata package from its local clone (branch dev), so the numbers
# follow the package. Run from the repository root:
#   Rscript talk/tools/make_data.R
suppressMessages({
  library(dplyr)
  library(tidyr)
  library(jsonlite)
})

ghedata_path <- path.expand(
  "~/Documents/gitrepos/gh-org-global-health-engineering/ghedata"
)
suppressMessages(devtools::load_all(ghedata_path, quiet = TRUE))

snapshot_date <- unique(github_organisations$snapshot_date)
end_month <- max(github_commits$month)
months <- seq(end_month, by = "-1 month", length.out = 24)
current <- months[1:12]
previous <- months[13:24]

change <- function(...) {
  x <- github_commit_change(...)
  list(
    previous = x$commits_previous,
    current = x$commits_current,
    factor = round(x$factor, 1)
  )
}

learner <- "learner repository"

types <- github_repository_types |>
  filter(repository_type != learner) |>
  count(repository_type, visibility, wt = repos, name = "repos") |>
  pivot_wider(names_from = visibility, values_from = repos, values_fill = 0) |>
  mutate(total = public + private) |>
  arrange(desc(total))

commits_type_window <- github_commits_by_type |>
  mutate(window = case_when(
    month %in% current ~ "current",
    month %in% previous ~ "previous"
  )) |>
  filter(!is.na(window)) |>
  summarise(
    commits = sum(commits),
    assisted = sum(commits_assisted),
    automated = sum(commits_automated),
    bot = sum(commits_bot),
    .by = c(repository_type, window)
  ) |>
  pivot_wider(
    names_from = window,
    values_from = c(commits, assisted, automated, bot),
    values_fill = 0
  ) |>
  transmute(
    repository_type,
    previous = commits_previous,
    current = commits_current,
    factor = if_else(previous > 0, round(current / previous, 1), NA_real_),
    assisted_current,
    share_assisted_current = if_else(current > 0, round(assisted_current / current, 2), NA_real_),
    automated_previous,
    automated_current,
    bot_previous,
    bot_current
  ) |>
  arrange(desc(current))

data <- list(
  note = paste(
    "Every number on the slides comes from this file.",
    "Built by talk/tools/make_data.R from the ghedata package."
  ),
  snapshot_date = as.character(snapshot_date),
  proposals = list(
    note = paste(
      "From the ghedata proposals table. Amounts in other currencies are",
      "converted to CHF with the rate of 1 July of the year of submission.",
      "Proposals without a budget or a currency are not in the amounts."
    ),
    amount_chf = sum(proposals$budget_chf, na.rm = TRUE),
    amount_funded_chf = sum(
      proposals$budget_chf[proposals$status == "accepted"], na.rm = TRUE
    ),
    written = nrow(proposals),
    funded = sum(proposals$status == "accepted"),
    rejected = sum(proposals$status == "rejected"),
    pending = sum(proposals$status == "submitted"),
    withdrawn = sum(proposals$status == "withdrawn"),
    without_amount = sum(is.na(proposals$budget_chf)),
    first_year = min(proposals$submitted_year),
    first_submitted = as.character(min(proposals$submitted_date)),
    years = 2026 - min(proposals$submitted_year),
    steward_funded = sum(proposals$lead_data_steward & proposals$status == "accepted"),
    steward_funded_chf = sum(
      proposals$budget_chf[proposals$lead_data_steward & proposals$status == "accepted"]
    )
  ),
  steward = list(
    start_date = "2021-07-01",
    years_in_group = 5.4,
    hours_per_week = 20,
    persons = 1
  ),
  people = list(
    note = "Engagements in the group since 2021 from the ghedata people table: theses, semester projects and staff.",
    total = nrow(people),
    by_group = people |>
      mutate(group = case_when(
        type == "thesis" & degree == "bsc" ~ "Bachelor theses",
        type == "thesis" & degree == "msc" ~ "Master theses",
        type == "thesis" & degree == "phd" ~ "Doctoral theses",
        type == "sem-proj" ~ "Semester projects",
        TRUE ~ "Staff, interns and assistants"
      )) |>
      count(group, name = "n") |>
      arrange(desc(n)),
    by_year = people |> count(year, name = "n"),
    students_total = sum(people$degree %in% c("bsc", "msc", "phd")),
    students_by_degree_year = people |>
      filter(degree %in% c("bsc", "msc", "phd")) |>
      count(year, degree, name = "n") |>
      complete(year, degree = c("bsc", "msc", "phd"), fill = list(n = 0)) |>
      arrange(year, degree)
  ),
  github = list(
    organisations = nrow(github_organisations),
    organisations_commits_counted = sum(github_organisations$commits_counted),
    repositories_all = sum(github_repository_types$repos),
    repositories_learners = sum(
      github_repository_types$repos[github_repository_types$repository_type == learner]
    ),
    repositories_without_learners = sum(types$total),
    repositories_by_type = types,
    repositories_created_by_year = github_repository_types |>
      filter(repository_type != learner) |>
      count(created_year, wt = repos, name = "repos"),
    commit_windows = list(
      current = paste(format(min(current), "%B %Y"), "to", format(max(current), "%B %Y")),
      previous = paste(format(min(previous), "%B %Y"), "to", format(max(previous), "%B %Y"))
    ),
    commit_change_all = change(),
    commit_change_public = change(visibility = "public"),
    commit_change_private = change(visibility = "private"),
    commit_change_ghe_private = change(
      organisation = "Global-Health-Engineering", visibility = "private"
    ),
    note_commits = paste(
      "commits are commits made by people. Commits by bots and GitHub Actions",
      "(bot) and automated pushes by a device or a script under the account",
      "of a person (automated) are counted apart and are not part of commits."
    ),
    commit_classes_two_windows = github_commits |>
      mutate(window = case_when(
        month %in% current ~ "current",
        month %in% previous ~ "previous"
      )) |>
      filter(!is.na(window)) |>
      summarise(
        people = sum(commits),
        with_agent = sum(commits_assisted),
        automated = sum(commits_automated),
        bot = sum(commits_bot),
        all_non_merge = sum(commits + commits_automated + commits_bot),
        .by = window
      ),
    # Commits by group members per month, without workshop commits: the same
    # people and commits as commits_by_person. Slide 11 draws this table.
    commits_per_month = github_commits_by_members |>
      arrange(month) |>
      transmute(month = format(month, "%Y-%m"), commits, assisted = commits_assisted),
    # The same months counted for everyone in the organisations, workshops and
    # people outside the group included (the table github_commits).
    commits_per_month_everyone = github_commits |>
      summarise(
        commits = sum(commits),
        assisted = sum(commits_assisted),
        automated = sum(commits_automated),
        bot = sum(commits_bot),
        repos_active = sum(repos_active),
        .by = month
      ) |>
      arrange(month) |>
      mutate(month = format(month, "%Y-%m")),
    members_two_windows = local({
      m <- github_commits_by_members
      cur <- m[m$month %in% current, ]
      pre <- m[m$month %in% previous, ]
      list(
        commits_previous = sum(pre$commits),
        commits_current = sum(cur$commits),
        factor = round(sum(cur$commits) / sum(pre$commits), 1),
        assisted_share_previous = round(sum(pre$commits_assisted) / sum(pre$commits), 2),
        assisted_share_current = round(sum(cur$commits_assisted) / sum(cur$commits), 2)
      )
    }),
    commits_per_month_by_type = github_commits_by_type |>
      summarise(
        commits = sum(commits),
        assisted = sum(commits_assisted),
        automated = sum(commits_automated),
        bot = sum(commits_bot),
        .by = c(month, repository_type)
      ) |>
      arrange(month, repository_type) |>
      mutate(month = format(month, "%Y-%m")),
    commits_by_type_two_windows = commits_type_window,
    # github_commits_by_person holds group members only, without workshop
    # commits. A row with 0 commits took a workshop and has no commit since.
    persons = sum(github_commits_by_person$commits > 0),
    persons_with_trained = nrow(github_commits_by_person),
    persons_without_agent = sum(
      github_commits_by_person$commits > 0 & github_commits_by_person$commits_assisted == 0
    ),
    first_person_share = round(
      github_commits_by_person$commits[1] / sum(github_commits_by_person$commits), 2
    ),
    assisted_share_members = round(
      sum(github_commits_by_person$commits_assisted) / sum(github_commits_by_person$commits), 2
    ),
    trained = sum(github_commits_by_person$workshop == "participant"),
    trained_practising = sum(
      github_commits_by_person$workshop == "participant" & github_commits_by_person$commits > 0
    ),
    trained_not_yet = sum(
      github_commits_by_person$workshop == "participant" & github_commits_by_person$commits == 0
    ),
    commits_by_person = github_commits_by_person |>
      select(rank = person_rank, commits, assisted = commits_assisted, workshop),
    assisted_share_current = round(
      sum(github_commits$commits_assisted[github_commits$month %in% current]) /
        sum(github_commits$commits[github_commits$month %in% current]), 2
    ),
    assisted_share_previous = round(
      sum(github_commits$commits_assisted[github_commits$month %in% previous]) /
        sum(github_commits$commits[github_commits$month %in% previous]), 2
    )
  ),
  gulu = list(
    note = "Public facts of the data package guluswm, https://doi.org/10.5281/zenodo.23918126",
    package = "guluswm",
    place = "Gulu City, Uganda",
    doi = "10.5281/zenodo.23918126",
    website = "https://openwashdata.github.io/guluswm/",
    households_survey = 424,
    households_waste = 95,
    authors = 9,
    files_received = "2026-10-30",
    released = "2026-11-03",
    days_to_release = 4,
    questions_to_authors = 50,
    days_until_answered = 3
  ),
  talk = list(
    title = "Embedded data stewardship and research intelligence: five years of practice at a research group at ETH Zurich",
    authors = "Lars Schöbitz, Colin Walder, Adriana Clavijo Daza, Elizabeth Tilley",
    affiliation = "Global Health Engineering, ETH Zurich",
    event = "Research Data Conference 2026, Bern, 19 November 2026",
    workshop = "Git for Scientists, Friday 20 November, 09:30, room Wytsicht",
    package_url = "https://github.com/Global-Health-Engineering/ghedata",
    slides_repo = "https://github.com/larnsce/rdc-2026"
  )
)

out <- file.path("talk", "shared", "data.json")
write_json(data, out, pretty = TRUE, auto_unbox = TRUE, digits = NA)
writeLines(
  paste0("window.TALK = ", toJSON(data, auto_unbox = TRUE, digits = NA), ";"),
  file.path("talk", "shared", "data.js")
)
message("written ", out)

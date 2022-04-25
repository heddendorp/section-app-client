job("My project warmup data") {
    startOn {
        schedule { cron("0 7 * * *") }
    }

    // ide is an IDE you want Automation to build indexes for:
    // Ide.Fleet || Ide.Idea || Ide.GoLand
    warmup(ide = Ide.WebStorm) {
        // (Optional) path to your custom .sh script
        // that contains additional warmup steps,
        // e.g. 'gradlew assemble'
        // If you want Automation only to build indexes,
        // don't specify scriptLocation
        // scriptLocation = "./dev-env-warmup.sh"

        // (Optional) IDE version to use instead of the
        // organization default. You can also use
        // ideVersion = IdeVersion.LatestOfQuality("Release").
        // ideVersion = IdeVersion.Specific("2021.3", "Release")
    }

    // (Optional, recommended)
    git {
        // fetch the entire commit history
        depth = UNLIMITED_DEPTH
        // fetch all branches
        refSpec = "refs/*:refs/*"
    }
}
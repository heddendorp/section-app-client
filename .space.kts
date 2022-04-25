job("My project warmup data") {
    startOn {
        schedule { cron("0 7 * * *") }
        gitPush {
            branchFilter {
                +"refs/heads/main"
            }
        }
    }

    // ide is an IDE you want Automation to build indexes for:
    // Ide.Fleet || Ide.Idea || Ide.GoLand
    warmup(ide = Ide.WebStorm) {
        env["DATABASE_URL"] = Secrets("database-url")
        env["SENDGRID_API_KEY"] = Secrets("sendgrid-key")
        env["AUTH0_SECRET"] = Secrets("auth0-secret")
        env["STRIPE_KEY"] = Secrets("stripe-key")
        env["BLOB_SAS_TOKEN"] = Secrets("azure-storage-token")
        env["PRODUCT_SAS_TOKEN"] = Secrets("azure-product-storage-token")
        env["PHOTO_SAS_TOKEN"] = Secrets("photo-storage-token")
        // (Optional) path to your custom .sh script
        // that contains additional warmup steps,
        // e.g. 'gradlew assemble'
        // If you want Automation only to build indexes,
        // don't specify scriptLocation
        scriptLocation = "./dev-env-warmup.sh"

        // (Optional) IDE version to use instead of the
        // organization default. You can also use
        ideVersion = IdeVersion.LatestOfQuality("Release").
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
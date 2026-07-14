plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    // Google Services (Firebase) — reads app/google-services.json.
    alias(libs.plugins.google.services)
}

android {
    namespace = "com.jkjobalerts.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.jkjobalerts.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        // The website the app wraps. Change here if the domain ever moves.
        buildConfigField("String", "SITE_URL", "\"https://jkjobalerts.com/\"")
        buildConfigField("String", "SITE_HOST", "\"jkjobalerts.com\"")
    }

    signingConfigs {
        // Optional release signing driven by ./keystore.properties (kept out of git).
        // See android/README.md for how to generate a keystore.
        create("release") {
            val keystorePropertiesFile = rootProject.file("keystore.properties")
            if (keystorePropertiesFile.exists()) {
                val props = java.util.Properties().apply {
                    load(keystorePropertiesFile.inputStream())
                }
                storeFile = file(props.getProperty("storeFile"))
                storePassword = props.getProperty("storePassword")
                keyAlias = props.getProperty("keyAlias")
                keyPassword = props.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // Use the release signing config only when a keystore is configured;
            // otherwise fall back to debug signing so `assembleRelease` still works.
            signingConfig = if (rootProject.file("keystore.properties").exists()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
        }
        debug {
            // NB: no applicationIdSuffix — keeping the same applicationId for debug and
            // release means one google-services.json (single client) works for both.
            versionNameSuffix = "-debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        buildConfig = true
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.swiperefreshlayout)
    implementation(libs.androidx.webkit)
    implementation(libs.androidx.core.splashscreen)

    // Firebase (Cloud Messaging for job-alert push notifications).
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.messaging)
    implementation(libs.firebase.analytics)
}

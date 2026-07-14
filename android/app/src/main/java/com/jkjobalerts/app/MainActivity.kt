package com.jkjobalerts.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.webkit.CookieManager
import android.webkit.DownloadListener
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature
import com.jkjobalerts.app.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var lastBackPressTime = 0L
    private var isLoadFailed = false

    /** Handles the <input type="file"> chooser result from web forms. */
    private val fileChooserLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val callback = filePathCallback ?: return@registerForActivityResult
            val uris: Array<Uri>? = when {
                result.resultCode != RESULT_OK -> null
                result.data?.clipData != null -> {
                    val clip = result.data!!.clipData!!
                    Array(clip.itemCount) { i -> clip.getItemAt(i).uri }
                }
                result.data?.data != null -> arrayOf(result.data!!.data!!)
                else -> null
            }
            callback.onReceiveValue(uris)
            filePathCallback = null
        }

    /** Runtime permissions (POST_NOTIFICATIONS on 13+, storage on 9 and below). */
    private val permissionsLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { /* no-op */ }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Keep the splash on screen until the first page starts rendering.
        var contentReady = false
        splashScreen.setKeepOnScreenCondition { !contentReady }

        configureWebView()
        setupSwipeRefresh()
        setupBackNavigation()
        requestRuntimePermissions()

        // "Try again" on the offline screen.
        binding.errorView.retryButton.setOnClickListener {
            binding.errorView.root.visibility = android.view.View.GONE
            binding.webView.visibility = android.view.View.VISIBLE
            loadIntentUrlOrHome(intent)
        }

        binding.webView.webViewClient = object : AppWebViewClient() {
            override fun onPageStarted(view: WebView, url: String?, favicon: android.graphics.Bitmap?) {
                isLoadFailed = false
                binding.progressBar.visibility = android.view.View.VISIBLE
                super.onPageStarted(view, url, favicon)
            }

            override fun onPageFinished(view: WebView, url: String?) {
                contentReady = true
                binding.progressBar.visibility = android.view.View.GONE
                binding.swipeRefresh.isRefreshing = false
                if (!isLoadFailed) {
                    binding.errorView.root.visibility = android.view.View.GONE
                    binding.webView.visibility = android.view.View.VISIBLE
                }
                super.onPageFinished(view, url)
            }
        }

        if (savedInstanceState != null) {
            binding.webView.restoreState(savedInstanceState)
        } else {
            loadIntentUrlOrHome(intent)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        loadIntentUrlOrHome(intent)
    }

    /** If launched from a notification with a target URL, open it; else load the site. */
    private fun loadIntentUrlOrHome(intent: Intent?) {
        val target = intent?.getStringExtra(EXTRA_TARGET_URL)
            ?: intent?.data?.takeIf { it.host?.contains(BuildConfig.SITE_HOST) == true }?.toString()
        binding.webView.loadUrl(target ?: BuildConfig.SITE_URL)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val webView = binding.webView
        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            loadWithOverviewMode = true
            useWideViewPort = true
            builtInZoomControls = true
            displayZoomControls = false
            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(false)
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            userAgentString = "$userAgentString JKJobAlertsApp/${BuildConfig.VERSION_NAME}"
        }

        // Follow the system light/dark setting where the WebView supports it.
        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
            WebSettingsCompat.setAlgorithmicDarkeningAllowed(webView.settings, true)
        }

        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView, newProgress: Int) {
                binding.progressBar.progress = newProgress
            }

            override fun onShowFileChooser(
                webView: WebView,
                filePathCallback: ValueCallback<Array<Uri>>,
                fileChooserParams: FileChooserParams
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback
                return try {
                    fileChooserLauncher.launch(fileChooserParams.createIntent())
                    true
                } catch (e: ActivityNotFoundException) {
                    this@MainActivity.filePathCallback = null
                    false
                }
            }
        }

        webView.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            downloadFile(url, userAgent, contentDisposition, mimeType)
        })
    }

    private fun setupSwipeRefresh() {
        binding.swipeRefresh.setColorSchemeResources(R.color.brand_primary, R.color.brand_accent)
        binding.swipeRefresh.setOnRefreshListener {
            if (isOnline()) {
                binding.webView.reload()
            } else {
                binding.swipeRefresh.isRefreshing = false
                showOffline()
            }
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (binding.webView.canGoBack()) {
                    binding.webView.goBack()
                } else {
                    val now = System.currentTimeMillis()
                    if (now - lastBackPressTime < 2000) {
                        finish()
                    } else {
                        lastBackPressTime = now
                        Toast.makeText(
                            this@MainActivity,
                            R.string.press_back_again,
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
        })
    }

    private fun requestRuntimePermissions() {
        val needed = mutableListOf<String>()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) {
                needed += Manifest.permission.POST_NOTIFICATIONS
            }
        }
        // Storage is only required (and only exists as a grantable permission) on API <= 28.
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED
            ) {
                needed += Manifest.permission.WRITE_EXTERNAL_STORAGE
            }
        }
        if (needed.isNotEmpty()) {
            permissionsLauncher.launch(needed.toTypedArray())
        }
    }

    private fun downloadFile(url: String, userAgent: String, contentDisposition: String, mimeType: String) {
        try {
            val request = DownloadManager.Request(Uri.parse(url)).apply {
                setMimeType(mimeType)
                addRequestHeader("User-Agent", userAgent)
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                val fileName = URLUtil.guessFileName(url, contentDisposition, mimeType)
                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
                setTitle(fileName)
                setDescription(getString(R.string.downloading))
            }
            val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            dm.enqueue(request)
            Toast.makeText(this, R.string.download_started, Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, R.string.download_failed, Toast.LENGTH_SHORT).show()
        }
    }

    private fun showOffline() {
        isLoadFailed = true
        binding.progressBar.visibility = android.view.View.GONE
        binding.webView.visibility = android.view.View.GONE
        binding.errorView.root.visibility = android.view.View.VISIBLE
    }

    private fun isOnline(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as android.net.ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(network) ?: return false
        return caps.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        binding.webView.saveState(outState)
    }

    override fun onPause() {
        super.onPause()
        binding.webView.onPause()
    }

    override fun onResume() {
        super.onResume()
        binding.webView.onResume()
    }

    override fun onDestroy() {
        binding.webView.destroy()
        super.onDestroy()
    }

    /**
     * WebViewClient that keeps navigation inside the app for jkjobalerts.com pages
     * and hands everything else (tel:, mailto:, whatsapp, telegram, other sites)
     * to the appropriate external app. Also renders the offline error screen.
     */
    private open inner class AppWebViewClient : WebViewClient() {

        override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
            val url = request.url
            val scheme = url.scheme?.lowercase() ?: return false
            val host = url.host?.lowercase() ?: ""

            // Non-web schemes -> hand to the system (dialer, email, WhatsApp, etc.).
            if (scheme != "http" && scheme != "https") {
                return openExternally(url)
            }

            // Keep our own domain inside the WebView.
            if (host.contains(BuildConfig.SITE_HOST)) {
                return false
            }

            // Everything else (Google, social share links, third-party sites)
            // opens in the user's browser / target app.
            return openExternally(url)
        }

        override fun onReceivedError(
            view: WebView,
            request: WebResourceRequest,
            error: WebResourceError
        ) {
            // Only surface the offline page for the main frame.
            if (request.isForMainFrame) {
                showOffline()
            }
            super.onReceivedError(view, request, error)
        }

        private fun openExternally(uri: Uri): Boolean {
            return try {
                startActivity(Intent(Intent.ACTION_VIEW, uri).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                })
                true
            } catch (e: ActivityNotFoundException) {
                Toast.makeText(this@MainActivity, R.string.no_app_to_open, Toast.LENGTH_SHORT).show()
                true
            }
        }
    }

    companion object {
        const val EXTRA_TARGET_URL = "target_url"
    }
}


package com.au11no.lifted;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Enable better debugging for WebView
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Add a WebViewClient to catch and log errors
        bridge.getWebView().setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e("Lifted", "WebView error: " + error.getDescription() + " for URL: " + request.getUrl());
            }
        });
    }
}

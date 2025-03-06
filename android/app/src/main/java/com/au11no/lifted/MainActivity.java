
package com.au11no.lifted;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.content.Intent;
import android.os.PowerManager;
import android.net.Uri;
import android.provider.Settings;
import android.os.Build;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = new WebView(this);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        
        // Request battery optimization exemption for background processes
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = this.getPackageName();
            PowerManager pm = (PowerManager) this.getSystemService(POWER_SERVICE);
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + packageName));
                this.startActivity(intent);
            }
        }
    }
}

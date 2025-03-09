
package com.au11no.lifted;

import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.net.Uri;
import android.os.PowerManager;
import android.content.Context;
import android.util.Log;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestBatteryOptimizationExemption();
    }

    private void requestBatteryOptimizationExemption() {
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);

        if (pm != null && !pm.isIgnoringBatteryOptimizations(getPackageName())) {
            Log.d(TAG, "Requesting battery optimization exemption");

            Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + getPackageName()));
            try {
                startActivity(intent);
                Toast.makeText(this, "Please disable battery optimization for the app to ensure timers work properly in the background.", Toast.LENGTH_LONG).show();
            } catch (Exception e) {
                Log.e(TAG, "Battery optimization request failed", e);
                Toast.makeText(this, "Please manually disable battery optimization for this app in device settings for proper timer functionality.", Toast.LENGTH_LONG).show();
            }
        } else {
            Log.d(TAG, "Battery optimization already disabled.");
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "App resumed");
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "App paused");
    }
}

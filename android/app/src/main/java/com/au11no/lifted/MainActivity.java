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
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestBatteryOptimizationExemption();
    }

    private void requestBatteryOptimizationExemption() {
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);

        if (pm != null && !pm.isIgnoringBatteryOptimizations(getPackageName())) {
            Log.d("BatteryOptimization", "Requesting battery optimization exemption");

            Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + getPackageName()));
            try {
                startActivity(intent);
                Toast.makeText(this, "Please disable battery optimization for the app.", Toast.LENGTH_LONG).show();
            } catch (Exception e) {
                Log.e("BatteryOptimization", "Battery optimization request failed", e);
            }
        } else {
            Log.d("BatteryOptimization", "Battery optimization already disabled.");
        }
    }
}

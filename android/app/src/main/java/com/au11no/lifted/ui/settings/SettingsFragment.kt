
package com.au11no.lifted.ui.settings

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import com.au11no.lifted.R

class SettingsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_settings, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Set up profile button
        val btnProfile = view.findViewById<Button>(R.id.btn_profile)
        btnProfile.setOnClickListener {
            // Navigate to profile screen
        }
        
        // Set up logout button
        val btnLogout = view.findViewById<Button>(R.id.btn_logout)
        btnLogout.setOnClickListener {
            // Perform logout
        }
    }
}

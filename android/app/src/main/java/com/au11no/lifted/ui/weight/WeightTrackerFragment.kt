
package com.au11no.lifted.ui.weight

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.au11no.lifted.R
import com.google.android.material.floatingactionbutton.FloatingActionButton

class WeightTrackerFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_weight_tracker, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Set up add weight button
        val fabAddWeight = view.findViewById<FloatingActionButton>(R.id.fab_add_weight)
        fabAddWeight.setOnClickListener {
            // Show add weight dialog
        }
    }
}

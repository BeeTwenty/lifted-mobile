
package com.au11no.lifted.ui.workouts

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.au11no.lifted.R
import com.google.android.material.floatingactionbutton.FloatingActionButton

class WorkoutsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_workouts, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Set up add workout button
        val fabAddWorkout = view.findViewById<FloatingActionButton>(R.id.fab_add_workout)
        fabAddWorkout.setOnClickListener {
            // Navigate to add workout screen
        }
    }
}

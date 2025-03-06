
package com.au11no.lifted.data.models

import kotlinx.serialization.Serializable

@Serializable
data class Exercise(
    val id: String,
    val name: String,
    val sets: Int,
    val reps: Int,
    val weight: Double? = null,
    val notes: String? = null,
    val order: Int? = null,
    val workout_id: String,
    val rest_time: Int? = 60,
    val media_url: String? = null
)

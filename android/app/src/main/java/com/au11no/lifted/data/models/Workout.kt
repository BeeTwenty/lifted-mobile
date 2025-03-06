
package com.au11no.lifted.data.models

import kotlinx.serialization.Serializable

@Serializable
data class Workout(
    val id: String,
    val title: String,
    val duration: Int,
    val notes: String? = null,
    val default_rest_time: Int? = 60,
    val user_id: String
)

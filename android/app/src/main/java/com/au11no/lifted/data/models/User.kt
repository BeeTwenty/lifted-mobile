
package com.au11no.lifted.data.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String,
    val email: String
)

@Serializable
data class Profile(
    val id: String,
    val username: String? = null,
    val full_name: String? = null,
    val avatar_url: String? = null,
    val age: Int? = null,
    val height: Double? = null,
    val workout_goal: Int? = 5,
    val hour_goal: Int? = 10
)

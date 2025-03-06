
package com.au11no.lifted.data.models

import kotlinx.serialization.Serializable

@Serializable
data class WeightRecord(
    val id: String,
    val weight: Double,
    val date: String,
    val user_id: String,
    val created_at: String
)

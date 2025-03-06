
package com.au11no.lifted.data.repositories

import com.au11no.lifted.data.SupabaseService
import com.au11no.lifted.data.models.User
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.gotrue.providers.Email
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AuthRepository {
    private val supabase = SupabaseService.supabase

    suspend fun signIn(email: String, password: String): Result<User> = withContext(Dispatchers.IO) {
        try {
            val response = supabase.auth.signInWith(Email) {
                this.email = email
                this.password = password
            }
            
            val user = User(
                id = response.session.user.id,
                email = response.session.user.email ?: ""
            )
            
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signUp(email: String, password: String): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            supabase.auth.signUpWith(Email) {
                this.email = email
                this.password = password
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signOut(): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            supabase.auth.signOut()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getCurrentUser(): User? {
        val session = supabase.auth.currentSessionOrNull()
        return session?.let {
            User(
                id = it.user.id,
                email = it.user.email ?: ""
            )
        }
    }
}

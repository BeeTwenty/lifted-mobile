
package com.au11no.lifted.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.au11no.lifted.MainActivity
import com.au11no.lifted.R
import com.au11no.lifted.data.repositories.AuthRepository
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private val authRepository = AuthRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Check if already signed in
        if (authRepository.getCurrentUser() != null) {
            navigateToMain()
            return
        }

        val emailInput = findViewById<EditText>(R.id.email_input)
        val passwordInput = findViewById<EditText>(R.id.password_input)
        val loginButton = findViewById<Button>(R.id.login_button)
        val signupButton = findViewById<Button>(R.id.signup_button)

        loginButton.setOnClickListener {
            val email = emailInput.text.toString()
            val password = passwordInput.text.toString()

            if (email.isBlank() || password.isBlank()) {
                Toast.makeText(this, "Email and password are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            lifecycleScope.launch {
                try {
                    val result = authRepository.signIn(email, password)
                    result.onSuccess {
                        navigateToMain()
                    }.onFailure { error ->
                        Toast.makeText(this@LoginActivity, "Login failed: ${error.message}", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@LoginActivity, "Login failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }

        signupButton.setOnClickListener {
            val email = emailInput.text.toString()
            val password = passwordInput.text.toString()

            if (email.isBlank() || password.isBlank()) {
                Toast.makeText(this, "Email and password are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            lifecycleScope.launch {
                try {
                    val result = authRepository.signUp(email, password)
                    result.onSuccess {
                        Toast.makeText(this@LoginActivity, "Sign up successful! Please check your email for verification.", Toast.LENGTH_LONG).show()
                    }.onFailure { error ->
                        Toast.makeText(this@LoginActivity, "Sign up failed: ${error.message}", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@LoginActivity, "Sign up failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun navigateToMain() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}

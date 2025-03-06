
package com.au11no.lifted.data

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.storage.Storage

object SupabaseService {
    private const val SUPABASE_URL = "https://ohahqtkbcbtcxidvrqwr.supabase.co"
    private const val SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYWhxdGtiY2J0Y3hpZHZycXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjY3OTAsImV4cCI6MjA1NjAwMjc5MH0.FSGc6JnH0MnJ_hUVFgUkvrKG4yykm759Q9wy9K1UDSw"
    
    val supabase = createSupabaseClient(
        supabaseUrl = SUPABASE_URL,
        supabaseKey = SUPABASE_ANON_KEY
    ) {
        install(Postgrest)
        install(GoTrue)
        install(Storage)
    }
}

package com.holistics.events.util

import java.text.Normalizer

object Slugs {
    private val NON_LATIN = Regex("[^\\w-]")
    private val WHITESPACE = Regex("[\\s]+")
    private val DASHES = Regex("-{2,}")

    fun slugify(input: String): String {
        val normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
            .replace(Regex("\\p{InCombiningDiacriticalMarks}+"), "")
        return WHITESPACE.replace(normalized.trim(), "-")
            .let { NON_LATIN.replace(it, "") }
            .let { DASHES.replace(it, "-") }
            .lowercase()
            .trim('-')
    }
}

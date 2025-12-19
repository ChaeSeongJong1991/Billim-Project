package com.billim

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BillimApplication

fun main(args: Array<String>) {
    runApplication<BillimApplication>(*args)
}

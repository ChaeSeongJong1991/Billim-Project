package com.billim.domain.contract.api

import com.billim.domain.contract.api.dto.ContractCreateRequest
import com.billim.domain.contract.api.dto.ContractResponse
import com.billim.domain.contract.application.ContractService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/contracts")
class ContractController(
    private val contractService: ContractService
) {

    @PostMapping
    fun create(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: ContractCreateRequest
    ): ResponseEntity<Long> {
        val contractId = contractService.create(userDetails.username, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(contractId)
    }

    @GetMapping("/building/{buildingId}")
    fun getByBuilding(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable buildingId: Long
    ): ResponseEntity<List<ContractResponse>> {
        val contracts = contractService.getContractsByBuilding(userDetails.username, buildingId)
        return ResponseEntity.ok(contracts)
    }
}

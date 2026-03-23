package com.billim.domain.contract.api

import com.billim.domain.contract.api.dto.ContractCreateRequest
import com.billim.domain.contract.api.dto.ContractRenewRequest
import com.billim.domain.contract.api.dto.ContractResponse
import com.billim.domain.contract.api.dto.ContractUpdateRequest
import com.billim.domain.contract.api.dto.ExpiringContractResponse
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

    @GetMapping("/building/{buildingId}/room/{roomNumber}")
    fun getByRoom(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable buildingId: Long,
        @PathVariable roomNumber: String
    ): ResponseEntity<ContractResponse> {
        val contract = contractService.getContractByRoom(userDetails.username, buildingId, roomNumber)
        return ResponseEntity.ok(contract)
    }

    @PutMapping("/{contractId}")
    fun update(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable contractId: Long,
        @Valid @RequestBody request: ContractUpdateRequest
    ): ResponseEntity<Unit> {
        contractService.update(userDetails.username, contractId, request)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/expiring")
    fun getExpiring(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam(defaultValue = "30") days: Long
    ): ResponseEntity<List<ExpiringContractResponse>> {
        val contracts = contractService.getExpiringContracts(userDetails.username, days)
        return ResponseEntity.ok(contracts)
    }

    @PostMapping("/{contractId}/renew")
    fun renew(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable contractId: Long,
        @Valid @RequestBody request: ContractRenewRequest
    ): ResponseEntity<Long> {
        val newContractId = contractService.renew(userDetails.username, contractId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(newContractId)
    }

    @PatchMapping("/{contractId}/terminate")
    fun terminate(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable contractId: Long
    ): ResponseEntity<Unit> {
        contractService.terminate(userDetails.username, contractId)
        return ResponseEntity.ok().build()
    }
}

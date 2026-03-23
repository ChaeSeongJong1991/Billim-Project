$headers = @{
    "Authorization" = "Bearer {TOKEN}"
    "Content-Type" = "application/json"
}

$body = @{
    buildingId = 1
    roomNumber = "201호"
    tenantName = "김철수"
    tenantPhone = "010-1234-5678"
    deposit = 10000000
    monthlyRent = 500000
    rentDay = 25
    startDate = "2024-01-01"
    endDate = "2026-01-01"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/contracts" -Method Post -Headers $headers -Body $body

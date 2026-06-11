Feature: Sample business logic execution

  Scenario: Successful business execution
    Given some input datas
    When the business service is invoked
    Then it should return a successful response
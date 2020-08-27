library(tidyverse)

set.seed(10)

mean_p <- 0
mean_exp <- 0

# Practice round incomes
while (mean_p != 500){
  incomes_p <- rnorm(n = 10, mean = 500, sd = 175) %>% 
    round()
  
  # Conditions:
    # Incomes must fall betwen $250-750
    # Half of incomes above and below $500
  if (min(incomes_p) < 250 | max(incomes_p) > 750 | sum(incomes_p < 500) != 5){
        next
  }
  
  mean_p <- incomes_p %>% 
    mean()
}

incomes_p %>% 
  sort()

# Experiment round incomes
while (mean_exp != 500){
  incomes_exp <- rnorm(n = 30, mean = 500, sd = 175) %>% 
    round()
  
  # Conditions:
    # Incomes must fall betwen $250-750
    # Half of incomes above and below $500
  if (min(incomes_exp) < 250 | max(incomes_exp) > 750 | sum(incomes_exp < 500) != 15){
    next
  }
  
  mean_exp <- incomes_exp %>% 
    mean()
}

incomes_exp %>% 
  sort()

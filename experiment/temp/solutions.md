## Solutions and Explanations

---

### Q1. Which of the following implies convergence in distribution?  
**Correct Answer:** B — Convergence in probability  
**Explanation:**  
Convergence in probability implies convergence in distribution, but not the other way around. The hierarchy is:  
$$
X_n \xrightarrow{a.s.} X \Rightarrow X_n \xrightarrow{p} X \Rightarrow X_n \xrightarrow{d} X
$$

---

### Q2. Let $X_n = \frac{1}{n}$, and define $X = 0$. Which type of convergence does $X_n \to X$ satisfy?  
**Correct Answer:** D — All of the above  
**Explanation:**  
Since $X_n$ is deterministic and tends to 0, it converges to 0 in every sense: almost surely (trivially), in probability, and in distribution.

---

### Q3. If $X_n \xrightarrow{a.s.} X$, then which of the following is **always** true?  
**Correct Answer:** D — Both B and C  
**Explanation:**  
Almost sure convergence is the strongest among the standard modes and implies both convergence in probability and distribution.

---

### Q4. Let $X_n \sim \text{Bernoulli}(1/2)$ for all $n$, and $X \sim \text{Bernoulli}(1/2)$, independent of $X_n$. Which of the following is true?  
**Correct Answer:** B — $X_n \xrightarrow{d} X$  
**Explanation:**  
Since all $X_n$ have the same distribution as $X$, they converge in distribution. But they are independent, so they do not converge in probability or almost surely.

---

### Q5. Which of the following best defines convergence in probability?  
**Correct Answer:** B — $\mathbb{P}(|X_n - X| > \epsilon) \to 0$ for every $\epsilon > 0$  
**Explanation:**  
This is the formal definition of convergence in probability. It means that the probability of the random variable deviating from the limit by more than any $\epsilon$ vanishes.

---

### Q6. Which type of convergence is **strongest** among the following?  
**Correct Answer:** C — Convergence almost surely  
**Explanation:**  
The strongest standard form is almost sure convergence. It implies convergence in probability, which in turn implies convergence in distribution.

---

### Q7. Let $X_n = \ln(n)$, and $X = \infty$. What can be said about the convergence of $X_n$ to $X$?  
**Correct Answer:** D — Not a valid convergence (limit is not a random variable)  
**Explanation:**  
In probability theory, convergence is defined to random variables (real-valued). $\infty$ is not a valid random variable, hence convergence is not defined.

---

### Q8. The Weak Law of Large Numbers ensures that the sample average:  
**Correct Answer:** B — Converges in probability to the expected value  
**Explanation:**  
The Weak Law states that as the sample size increases, the sample mean converges in probability to the population mean.

---

### Q9. If $X_n \xrightarrow{d} c$, where $c$ is a constant, what can we say about $X_n$?  
**Correct Answer:** A — $X_n \xrightarrow{p} c$  
**Explanation:**  
When the limit in distribution is a constant, convergence in distribution implies convergence in probability.

---

### Q10. If $X_n \xrightarrow{L^2} X$, then which of the following is **necessarily true**?  
**Correct Answer:** D — Both B and C  
**Explanation:**  
$L^2$ convergence implies convergence in mean square, which in turn implies convergence in probability and hence also in distribution.

---

### Q11. What does convergence almost surely mean, informally?  
**Correct Answer:** C — The values of $X_n$ get arbitrarily close to $X$ for almost all outcomes  
**Explanation:**  
Almost sure convergence means that the sequence converges to $X$ for all $\omega \in \Omega$, except for a set of measure zero.

---

### Q12. Suppose $X_n = \frac{n}{n+1}$ and $X = 1$. Which is true?  
**Correct Answer:** D — All of the above  
**Explanation:**  
$X_n$ is deterministic and converges to 1. Therefore, it converges to 1 in all senses: a.s., in probability, and in distribution.


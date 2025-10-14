### Introduction

In the realm of probability theory and statistical inference, it's common to encounter situations where we aim to estimate an unobservable random variable $X$ through a sequence of approximations. Suppose we cannot observe $X$ directly, but we can perform measurements or experiments to obtain estimates $X_1, X_2, X_3, \ldots$. Each subsequent estimate is derived from additional data or refined methodologies, with the hope that as $n$ increases, $X_n$ provides a more accurate approximation of $X$.

This leads us to the concept of **convergence**: we are interested in understanding whether and how the sequence $\{X_n\}$ approaches $X$ as $n \to \infty$. In probability theory, convergence isn't a singular notion but encompasses various types, each capturing a different aspect of how $X_n$ may become "close" to $X$. These include:

1. **Almost Sure Convergence**: $X_n$ converges to $X$ with probability 1.
2. **Convergence in Probability**: For any $\epsilon > 0$, the probability that $|X_n - X| > \epsilon$ approaches zero as $n \to \infty$.
3. **Convergence in Distribution**: The distribution functions of $X_n$ converge to the distribution function of $X$ at all continuity points.
4. **Mean Square Convergence**: The expected value of $|X_n - X|^2$ approaches zero as $n \to \infty$.


These are all different kinds of convergence. A sequence might converge in one sense but not another. Some of these convergence types are ''stronger'' than others and some are ''weaker.'' By this, we mean the following: If Type A convergence is stronger than Type B convergence, it means that Type A convergence implies Type B convergence. The below figure summarizes how these types of convergence are related. In this figure, the stronger types of convergence are on top and, as we move to the bottom, the convergence becomes weaker. For example, using the figure, we conclude that if a sequence of random variables converges in probability to a random variable $X$, then the sequence converges in distribution to $X$ as well.

![Different types of convergence and their relationship with each other](images/diff_types_of_convgnc_color.png)

---

### 1. Almost Sure Convergence

#### Definition

A sequence of random variables $\{X_n\}$ converges **almost surely** to a random variable $X$ if:

$$
\begin{equation}
\mathbb{P}\left( \lim_{n \to \infty} X_n = X \right) = 1
\end{equation}
$$

This means that the sequence $X_n$ converges to $X$ for almost every outcome in the sample space.
Almost sure convergence implies that, with probability 1, the sequence $X_n(\omega)$ approaches $X(\omega)$ as $n \to \infty$. It's akin to saying that the convergence happens for "almost every" individual outcome.

#### Example

Consider the sequence:

$$
X_n(\omega) = \omega^{1/n}, \quad \omega \in [0,1]
$$

As $n \to \infty$, $X_n(\omega) \to 1$ for all $\omega \in [0,1]$. Therefore, $X_n$ converges almost surely to 1.

---

### 2. Convergence in Probability

#### Definition

Convergence in probability means that the probability of $X_n$ deviating from $X$ by more than $\epsilon$ becomes negligible as $n$ grows.
A sequence $\{X_n\}$ converges **in probability** to $X$ if, for every $\epsilon > 0$:

$$
\begin{equation}
\lim_{n \to \infty} \mathbb{P}(|X_n - X| > \epsilon) = 0
\end{equation}
$$

#### Example

Define:

$$
X_n =
\begin{cases}
n, & \text{with probability } \frac{1}{n} \\
0, & \text{with probability } 1 - \frac{1}{n}
\end{cases}
$$

Then $X_n \to 0$ in probability, since:

$$
\mathbb{P}(|X_n - 0| > \epsilon) = \frac{1}{n} \to 0 \quad \text{as } n \to \infty
$$

As mentioned previously, **convergence in probability is stronger than convergence in distribution**. That is, if
$X_n \xrightarrow{p} X$, then $X_n \xrightarrow{d} X$. The converse is not necessarily true.

For example, let $X_1, X_2, X_3, \dots$ be a sequence of i.i.d. **Bernoulli** $\left(\frac{1}{2}\right)$ random variables. Let also $X \sim \text{Bernoulli} \left( \frac{1}{2} \right)$ be independent from the $X_i$'s. Then, $X_n \xrightarrow{d} X$. However, $X_n$ does not converge in probability to $X$, since $|X_n - X|$ is in fact also a **Bernoulli** $\left( \frac{1}{2} \right)$ random variable, and

$$
P(|X_n - X| \geq \epsilon) = \frac{1}{2}, \quad \text{for } 0 < \epsilon < 1.
$$

---

A special case in which the **converse is true** is when $X_n \xrightarrow{d} c$, where $c$ is a constant. In this case, convergence in distribution **implies convergence in probability**. We can state the following theorem:

---

#### Theorem

If $X_n \xrightarrow{d} c$, where $c$ is a constant, then $X_n \xrightarrow{p} c$.

An example of convergence in probability is the weak law of large numbers (WLLN).

---

### 3. Convergence in Distribution

#### Definition

Convergence in distribution focuses on the behavior of the distribution functions. It implies that the distributions of $X_n$ approach the distribution of $X$ as $n \to \infty$.
Formally, a sequence $\{X_n\}$ converges **in distribution** to $X$ if, for all points $x$ where the cumulative distribution function (CDF) $F_X$ is continuous:

$$
\begin{equation}
\lim_{n \to \infty} F_{X_n}(x) = F_X(x)
\end{equation}
$$

#### Example

Let $X_2, X_3, X_4, \dots$ be a sequence of random variables with the cumulative distribution function:

$$
F_{X_n}(x) = \begin{cases} 1 - (1 - \frac{1}{n})^{nx} & x > 0 \\ 0 & \text{otherwise} \end{cases}
$$

Then $X_n$ converges in distribution to $\text{Exponential}(\lambda = 1)$.

---

### 4. Mean-Square Convergence

A sequence of random variables $X_1,X_2,\dots,X_n,\dots$ converges to a random variable $X$ in mean square (m.s.) if

$$
\lim_{n\to\infty} \mathbb{E}\big[(X_n - X)^2\big] = 0.
$$

We often write this as $X_n \xrightarrow{m.s.} X$.

---

### 5. Relationships Between Different Types of Convergence

As discussed previously, the different types of convergences are related to each other.

1. **Almost Sure Convergence** $\Rightarrow$ **Convergence in Probability** $\Rightarrow$ **Convergence in Distribution**
2. **Convergence in Mean Square** $\Rightarrow$ **Convergence in Probability** $\Rightarrow$ **Convergence in Distribution**

| Type of Convergence | Notation                     | Implies                     |
| ------------------- | ---------------------------- | --------------------------- |
| Almost Sure         | $X_n \xrightarrow{a.s.} X$ | Convergence in Probability  |
| In Mean Square      | $X_n \xrightarrow{m.s.} X$ | Convergence in Probability  |
| In Probability      | $X_n \xrightarrow{P} X$    | Convergence in Distribution |
| In Distribution     | $X_n \xrightarrow{d} X$    | —                          |

However, the converses do not generally hold.

### 6. Weak Law of Large Numbers (WLLN)

#### Statement

Let $X_1, X_2, \ldots$ be i.i.d. random variables with finite mean $\mu$. Then:

$$
\begin{equation}
\bar{X}_n = \frac{1}{n} \sum_{i=1}^n X_i \xrightarrow{P} \mu
\end{equation}
$$

#### Intuition

The sample average $\bar{X}_n$ converges in probability to the expected value $\mu$ as the sample size increases.

#### Example

If $X_i \sim \text{Bernoulli}(0.5)$, then $\bar{X}_n \to 0.5$ in probability.

![WLON plot](images/wlln_simulation.png)

---

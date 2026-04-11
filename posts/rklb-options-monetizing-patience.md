---
title: "Patience Is the Position"
date: '2026-03-28'
excerpt: "I built a Black-Scholes backtester before I understood why my own trades kept failing. On gamma, greed, and what covered calls on a 10x conviction hold actually mean."
tags: ['Investing', 'Engineering']
series: "Investing"
series_position: 1
---

Today I finished building a covered calls playbook. Entry signals. Exit criteria. A P&L simulator with real-time Greeks. A Black-Scholes backtester with an optimization sweep.

Then I looked at my actual trade log.

The gap between those two things is what this post is about.

### What I Was Actually Doing

My first options trade on RKLB was a same-day expiration put, strike 41, sold for a $60 premium in November. I bought it back the same day for $55. I sold it because I wanted to generate premium. I bought it back because I suddenly realized I didn't fully understand what I'd sold.

That should have been the lesson. It wasn't.

In February, I sold a covered call at strike 64 for $232, expiring the next day. RKLB was trading close to that number. I knew it was close. I sold it anyway — a few extra dollars felt worth it. The stock ran. I had to roll the position to avoid assignment, booking a $150 realized loss while collecting $210 in new premium. Net: I paid to learn that "close enough to the price" is not a strike selection strategy.

The pattern continued through March: a short straddle opened for $940 and closed for $934. Break-even after weeks of managing two legs. Before that, multiple short puts bought back within days of selling them — each time, the math said hold, and the impulse said close.

The common thread wasn't the mechanics. I understood the mechanics. The thread was greed — wanting a few more dollars of premium despite the risk of losing far more. The rational version of myself knew better. The trading version kept finding reasons to ignore it.

The sharpest lesson came when I had to roll a previously profitable call. RKLB ran hard. A position I had been sitting comfortably on suddenly crossed the strike, and I had to buy it back at a loss to avoid assignment. There is a particular kind of humbling in watching a winning trade turn into a loser in real time — not because of bad analysis, but because you celebrated before crossing the finish line.

### What Stopping Taught Me

After the March cluster, I did something I should have done earlier: I stopped trading and just watched.

I tracked options on several stocks I was interested in — not to find entries, but to understand the pricing. What I noticed: option premiums move independently of the stock. IV compresses after earnings even when the stock itself barely moves. Theta grinds the value down on flat days. A stock can be completely unchanged and the option you sold yesterday is worth less today simply because time passed.

This sounds obvious on paper. It feels different when you watch it happen without money on the line. Options are priced on *expectation and time*, not just the stock. The stock is the underlying. It is not the whole story.

I also noticed how rarely the right entry appeared. Most days, nothing fit. That observation alone was worth the pause.

### Building the Tool I Should Have Had

Today I built the playbook that didn't exist during those months. Entry signals with IV Rank thresholds and DTE windows. Exit rules — 50% profit target, 21 DTE roll trigger. A strike selection framework anchored at delta -0.2 to -0.3 OTM. A P&L simulator with real-time scenario analysis. A Black-Scholes backtester with parameter sweeps. It's generalized on purpose — the same framework applies to any position on any stock.

I have not run it against my own RKLB history yet. I would rather not confirm in numbers what I already know: the early trades would have failed most of the filters I just codified.

The point of the tool is not discovery. It is commitment. Writing down the rules — in code, with real constraints — is the only thing that makes them durable against the next time greed shows up dressed as strategy.

### The Position That Is Actually Different

On March 25, I sold a covered call on RKLB: strike 95, expiring June 18, delta -0.2, premium $560. It is currently worth about $248 — roughly 56% decay since I opened it.

RKLB is trading at $60.70. I have held these shares since $6.48.

At that cost basis, assignment at 95 is not a loss. It is a ~14x gain on the shares that get called away, with the rest still in hand. The covered call is not speculation. It is yield on a conviction I have already been paid for. That is a different instrument from everything I was doing in November, even if the contract structure looks identical.

When I opened this position, I was still carrying the anxiety from the previous months. I brought it to Claude — not for a trade recommendation, but out of something closer to desperation: I needed something that had no emotional stake in the outcome to tell me what I was actually looking at. That conversation is what reframed the question from "am I losing money?" to "am I being paid to wait?" At delta -0.2 with 82 days to expiry and time decay working in my favor, the answer is yes.

### What the Playbook Does Not Do

The tool does not trade for you. The rule does not override the impulse. The only thing that actually changed my behavior was losing money slowly enough to watch it happen, and then deliberately stopping.

The playbook is honest about what it is: a record of what the losses made legible. Not a guarantee of what I will do next time.

But it is harder to ignore a system you built yourself.

---

**Keep Reading:**
- [Conviction Is Not the Same as Durability](./portfolio-reclassification-march2026) — On why RKLB sits in the asymmetric layer and not the anchor, and what that distinction actually means for how I hold it
- []()
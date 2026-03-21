---
title: 'Conviction Is Not the Same as Durability'
date: '2026-03-19'
excerpt: 'A session that started with a UI bug and ended with me reclassifying half my portfolio. On building honestly, and the difference between believing in something and anchoring to it.'
tags: ['Investing', 'Engineering']
---

It started, as most of my refactors do, with something embarrassingly small.

The Research badge on my portfolio tracker was bleeding outside its column. The text was too long, the flex container wasn't wrapping, and the number was hanging off the edge like a misaligned price tag. I opened the file to fix it — a ten-minute job — and ended up spending the afternoon rethinking how I'd classified every position I hold.

That's the thing about building your own tools. They don't lie to you.

### The Prompt

While I was in the code, I looked at the layer labels. I'd put RKLB — Rocket Lab — in **Anchor**. The same layer as Coca-Cola and VTI.

Anchor, by my own definition, is for durable, irreplaceable holdings. Long-term holds you don't second-guess. The kind of stock Buffett writes about in his shareholder letters: businesses with moats so wide that time works *for* you rather than against you. KO has been in his portfolio for over 35 years. He's talked about it in those terms repeatedly — pricing power, brand permanence, no technological disruption risk worth losing sleep over.

Rocket Lab is pre-profitability. It's volatile. It had a rough stretch that tested a lot of holders. And I still own 115 shares.

So why was it in Anchor?

Because I *believe* in it. But that's not the same thing.

### Conviction vs. Durability

This is the distinction I landed on, and I think it's underrated in how most retail investors think about portfolio construction.

Buffett's framework is about durability — businesses that compound quietly over decades. Burry's framework (when he's at his best, not just making macro bets) is about asymmetric positioning: find situations where the downside is bounded and the upside is large relative to what the market is pricing in. These are not the same philosophy, and they shouldn't live in the same bucket.

RKLB is the second thing. I believe Rocket Lab has a genuine shot at being the infrastructure layer of the commercial space industry — the way Boeing became indispensable to aviation. That's a 10+ year thesis. I'm prepared to watch it swing 40% in either direction without blinking. But that's not an Anchor. That's an **Asymmetric** bet. The expected return is large *because* the uncertainty is large. Putting it in the same layer as KO wasn't honest.

I renamed the category. I moved RKLB there. I moved IBM there too — its thesis is quantum computing and hybrid cloud, neither of which is proven. Great dividend, but the dividend is a floor, not the thesis.

Then I moved KO and VTI to Anchor, which is where they should have been from the start. VTI especially — Buffett's single most consistent public recommendation is "buy a low-cost index fund and hold it forever." Putting it in Income was almost comically wrong.

I also created a separate **Research** layer — a true simulation sandbox. Positions there don't count toward real portfolio value. You can toggle it on to see what your portfolio would look like if you pulled the trigger, without pretending you already have.

### The Technical Cleanup

While I had the codebase open, I did a server audit. Personal projects are where bad habits accumulate invisibly because no one's paying an AWS bill.

A few things I found: the performance chart was fetching five years of monthly data for all eleven positions on every single page load. I made it lazy — you click to load it. Historical monthly data doesn't change intraday, so I added 24-hour cache headers. Real-time quotes got 15-minute caching. And I removed Mongoose entirely — I was using it as a wrapper around a three-field MongoDB collection. The raw driver does the same thing with a fraction of the overhead.

None of this is dramatic. But it's the kind of thing that separates a project you're proud of from one you quietly stop linking to.

### Why I'm Writing This

I've been thinking about what this site is actually for. It's not a portfolio in the job-application sense — I have a résumé for that. It's more of a workbench that's open to the public. The portfolio tracker is a real tracker. The code is running against real data. The reclassification I made today reflects what I actually think.

That feels more interesting to me than a polished case study. The interesting part isn't the conclusion. It's the afternoon where a broken badge made me question whether I'd been honest with myself about why I own certain things.

RKLB is still there. I still think it wins. I just stopped pretending it's the same kind of bet as Coca-Cola.

---
*The portfolio is live at [Portfolio (Chart currently out of order due to migration)](/portfolio). The framework behind it is built on Buffett's concept of durable competitive advantage and Burry's approach to asymmetric positioning — two philosophies that are more complementary than they first appear.*

---
title: You Can Be Tracked on WhatsApp Without Receiving a Single Message
description: Demonstrates how WhatsApp delivery receipt timing can be used as a side-channel to infer a user’s device activity and online state without sending visible messages.
publishedDate: 2026-03-06
author: Bassam Khan
tags:
  - sidechannel
  - Cybersecurity
  - privacy
  - OSINT
---

# Introduction
I saw an interesting post on [Reddit](https://www.reddit.com/r/cybersecurity/comments/1pgmvtk/how_almost_any_phone_number_can_be_tracked_via/) the other day, which listed an interesting WhatsApp side-channel attack that can be used for surveillance purposes. This attack/technique is based on the following paper [**Careless Whisper: Exploiting Silent Delivery Receipts to Monitor Users on Mobile Instant Messengers.**](https://arxiv.org/abs/2411.11194)

# How it Works
This can be performed by anyone on any number, and how it works is by basically sending tiny probes in 2 of the following ways:

![WhatsApp probing methods used in the side-channel attack](@/assets/blog/2026/whatsapp-probing-methods.jpg)

WhatsApp, in turn, sends back silent delivery receipts. This method measures the round-trip time (RTT) of those receipts, and using those we can infer patterns such as:

*   Low RTT ≈ screen on/active, usually on Wi-Fi
*   A bit higher RTT ≈ screen on/active, on mobile data
*   High RTT ≈ screen off/standby on Wi-Fi
*   Very High RTT ≈ screen off/bad reception
*   Timeouts/repeated failures ≈ offline

The target does not see anything during this process unless they are actively inspecting raw network traffic, in which case they might notice an unusual, regularly timed pattern of probes. Aside from being invisible, the technique can also consume noticeably more mobile data and battery than normal idle usage on the victim’s device.

Over time, this makes it possible to infer user behavior, such as when someone is likely at home (stable Wi-Fi RTTs), asleep (extended periods of standby or inactivity), or moving between locations (variable mobile data RTTs). In practice, this enables continuous, long-term surveillance rather than a one-off observation.

The only practical mitigation is enabling restrictions on messages from unknown numbers. Even then, the issue remains exploitable by anyone already present in the victim’s contact list, meaning the protection is incomplete.

## How to Replicate this
---------------------

The guy who posted this also posted a PoC on GitHub. However, I’m also going to summarize the steps here:

```bash
git clone https://github.com/gommzystudio/device-activity-tracker.git #clone the repo
cd device-activity-tracker
```

After that, we need to run:

```bash
#Install dependencies
npm install
cd client && npm install && cd ..
```

We need npm version 20+, and if we don't have it, we'll need to use nvm.

```bash
#Install nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
#install npm 20
nvm install 20
nvm use 20
```

### How to run it

Since it’s a PoC, it’s still a bit buggy at times; however, to start it we will use:

```bash
#Terminal 1: Start backend
npm run start:server
```

After this, we have 2 options: either start the frontend in the browser or on the CLI. When I tested it, the CLI would go into an error loop after some time, whereas the Web Browser sometimes gave inaccurate results. So it’s recommended to try out either of the ways and find out what works for you :

```bash
#Terminal 2: Start frontend
npm run start:client

#Start CLI
npm start
```

Do keep in mind that you have to run this in another terminal. And after you start either of those, you will need to sign in to WhatsApp by scanning the QR code and then enter the phone number to track (e.g., `92xxxxxxxxxx`). You don't need to classify the RTT values yourself as the tool will automatically do it for you:

*   **🟢 Online**: Device is actively being used (RTT below threshold)
*   **🟡 Standby**: Device is idle/locked (RTT above threshold)
*   **🔴 Offline**: Device is offline or unreachable (no CLIENT ACK received)

If you run into issues or an error, then stop both running tasks and delete the `auth_info_baileys/` folder. Then rescan the QR code. Also, try switching between the different probe methods **Delete** or **Reaction**.

# Further Details
The research shows that WhatsApp and Signal expose a serious **protocol-level privacy vulnerability** rooted in how delivery receipts work in modern end-to-end encrypted, multi-device messaging systems. By abusing _silent message type,_ most notably message reaction, an attacker can trigger delivery receipts without generating any notification or visible trace on the victim’s device. Because these reactions can be sent (or even removed) at very high frequencies and, critically, **without any prior conversation**, anyone who knows a target’s phone number can covertly probe their device. Measuring the round-trip time (RTT) of these receipts forms a powerful timing side channel that allows real-time behavioral inference, including whether the screen is on or off, whether the app is in the foreground or background, and long-term activity patterns such as daily routines. On iOS, for example, RTTs cluster around ~2 seconds when the screen is off, ~1 second when on, and drop to ~300 ms when the app is actively open.

The attack is further amplified by **multi-device client fan-out architectures**. Each linked device (phone, desktop, web client) responds independently, allowing attackers to count devices, track their individual online states, and fingerprint operating systems based on receipt ordering and implementation quirks. Beyond surveillance, the same mechanism enables **stealthy resource exhaustion attacks**: WhatsApp allows reaction payloads of up to ~1 MB at the server level, enabling attackers to silently force gigabytes of data transfer per hour and significantly drain battery life without alerts (measured at ~18% battery loss per hour on a standby iPhone). Signal mitigates this partially through stricter rate limits, but remains vulnerable to behavioral inference. The severity stems from the fact that delivery receipts are fundamental to E2EE reliability and cannot simply be disabled, leaving users with virtually no practical defense short of abandoning the platform.

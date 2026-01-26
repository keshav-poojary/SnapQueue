# SnapQueue 🚀

**SnapQueue** is a developer-friendly **background job SaaS** for handling asynchronous tasks like emails, SMS, webhooks, file processing, sftp file uploads and more.  
It’s built with **NestJS, DynamoDB, and AWS SQS** and allows developers to **push jobs via API** and process them reliably at scale.

---

## Features ✨

- Push **any background job** (email, SMS, webhook, image processing, ML jobs, etc.)
- Asynchronous **queue processing** using AWS SQS
- Automatic **retry & failure handling**
- Optional **webhook callbacks** for job completion
- **Scalable and serverless-friendly** architecture
- **Scheduled jobs** and cron-like support

---

## Tech Stack 🛠️

- **Backend:** NestJS (Node.js + TypeScript)  
- **Database:** DynamoDB (Queues & Jobs)  
- **Queue:** AWS SQS  
- **Worker:** AWS Lambda / ECS  
- **Infra:** Docker, Terraform  
- **Monitoring:** Newrelic 

---



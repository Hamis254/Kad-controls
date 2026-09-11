# Kad Controls

Next.js e-commerce site and admin portal for Kad Controls Ltd.

## Local development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values.
3. Apply the database migrations: `npm run db:migrate`
4. Start the app: `npm run dev`

Open `http://localhost:3000`. The admin portal is at `/admin`.

## Production deployment

This project can be deployed as a Next.js app on Vercel or another Node.js host.

1. Create a PostgreSQL database and provide its connection string as `DATABASE_URL`.
2. Run `npm run db:migrate` against that database before the first deployment.
3. Add every variable from `.env.example` to the host's production environment. Use a new random `JWT_SECRET` and a strong `ADMIN_PASSWORD` for production.
4. Deploy with the standard commands:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
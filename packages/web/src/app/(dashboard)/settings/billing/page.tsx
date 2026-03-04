"use client";

import {
  CreditCard,
  Download,
  ArrowUpRight,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "5 recordings/month",
      "720p export",
      "Basic editing",
      "1 user",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: [
      "Unlimited recordings",
      "4K export",
      "Advanced editing",
      "AI captions",
      "5 team members",
      "Custom branding",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    features: [
      "Everything in Pro",
      "Unlimited members",
      "Knowledge Base",
      "Academy builder",
      "Analytics",
      "SSO & SAML",
      "Priority support",
    ],
    current: false,
  },
];

const invoices = [
  { id: "INV-001", date: "Mar 1, 2026", amount: "$19.00", status: "Paid" },
  { id: "INV-002", date: "Feb 1, 2026", amount: "$19.00", status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2026", amount: "$19.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Billing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the Pro plan.
            </CardDescription>
          </div>
          <Badge variant="default">
            <Zap className="mr-1 h-3 w-3" />
            Pro
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">$19</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Next billing date: April 1, 2026
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                Cancel Plan
              </Button>
              <Button size="sm">
                Upgrade
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Usage */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Usage this month</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Recordings", used: 42, limit: "Unlimited" },
                { label: "Storage", used: 2.4, limit: "10 GB", unit: "GB" },
                { label: "Team members", used: 3, limit: "5" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {item.used}
                    {item.unit && <span className="text-sm font-normal text-muted-foreground"> {item.unit}</span>}
                  </p>
                  <p className="text-xs text-zinc-500">of {item.limit}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? "border-primary/50" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-4">
                  <Badge variant="default">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {plan.current ? (
                    <Button variant="secondary" size="sm" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      {plan.name === "Free" ? "Downgrade" : "Upgrade"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </CardTitle>
            <CardDescription>Your default payment method.</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
            <div className="flex h-10 w-14 items-center justify-center rounded-md bg-zinc-800 text-xs font-bold text-zinc-300">
              VISA
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Visa ending in 4242
              </p>
              <p className="text-xs text-muted-foreground">Expires 12/2027</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-muted-foreground">
                    {invoice.id}
                  </span>
                  <span className="text-sm text-foreground">{invoice.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">
                    {invoice.amount}
                  </span>
                  <Badge variant="success">{invoice.status}</Badge>
                  <button className="text-zinc-500 transition-colors hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string(),
  amount: z.number(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "rent",
    amount: 1000,
  },
  {
    id: 2,
    title: "groceries",
    amount: 500,
  },
  {
    id: 3,
    title: "groceries",
    amount: 500,
  },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json(fakeExpenses);
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    c.status(201);
    return c.json(expense);
  })
  .get("/total-spent", (c) => {
    return c.json({
      totalSpent: fakeExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
      ),
    });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((expense) => expense.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((expense) => expense.id === id);
    if (index === -1) {
      return c.notFound();
    }
    fakeExpenses.splice(index, 1);
    return c.json({ deleted: true });
  });

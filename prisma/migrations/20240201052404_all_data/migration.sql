-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bank_name" TEXT NOT NULL,
    "account_type" TEXT NOT NULL DEFAULT 'current',
    "account_number" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BankAccountToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BankAccountToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "BankAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BankAccountToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BankAccountToExpense" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BankAccountToExpense_A_fkey" FOREIGN KEY ("A") REFERENCES "BankAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BankAccountToExpense_B_fkey" FOREIGN KEY ("B") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ExpenseToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ExpenseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ExpenseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToExpense" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToExpense_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToExpense_B_fkey" FOREIGN KEY ("B") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_BankAccountToUser_AB_unique" ON "_BankAccountToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BankAccountToUser_B_index" ON "_BankAccountToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BankAccountToExpense_AB_unique" ON "_BankAccountToExpense"("A", "B");

-- CreateIndex
CREATE INDEX "_BankAccountToExpense_B_index" ON "_BankAccountToExpense"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExpenseToUser_AB_unique" ON "_ExpenseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExpenseToUser_B_index" ON "_ExpenseToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToExpense_AB_unique" ON "_CategoryToExpense"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToExpense_B_index" ON "_CategoryToExpense"("B");

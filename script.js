        // Carregar transações do localStorage
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        // Definir data atual como padrão
        document.getElementById('date').valueAsDate = new Date();

        // Função para formatar moeda
        function formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        }

        // Função para formatar data
        function formatDate(dateString) {
            const date = new Date(dateString + 'T00:00:00');
            return date.toLocaleDateString('pt-BR');
        }

        // Função para atualizar os saldos
        function updateBalance() {
            const income = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const expense = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const balance = income - expense;

            document.getElementById('totalIncome').textContent = formatCurrency(income);
            document.getElementById('totalExpense').textContent = formatCurrency(expense);
            document.getElementById('balance').textContent = formatCurrency(balance);
        }

        // Função para renderizar transações
        function renderTransactions() {
            const transactionsList = document.getElementById('transactionsList');
            
            if (transactions.length === 0) {
                transactionsList.innerHTML = `
                    <div class="empty-state">
                        <svg fill="#ccc" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        <p>Nenhuma transação registrada ainda.</p>
                        <p>Adicione sua primeira transação acima!</p>
                    </div>
                `;
                return;
            }

            // Ordenar por data (mais recente primeiro)
            const sortedTransactions = [...transactions].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );

            transactionsList.innerHTML = sortedTransactions.map((transaction, index) => `
                <div class="transaction-item ${transaction.type}">
                    <div class="transaction-info">
                        <div class="description">${transaction.description}</div>
                        <div class="details">${formatDate(transaction.date)}</div>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
                    </div>
                    <button class="btn-delete" onclick="deleteTransaction(${transaction.id})">✕</button>
                </div>
            `).join('');
        }

        // Função para adicionar transação
        document.getElementById('transactionForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const transaction = {
                id: Date.now(),
                description: document.getElementById('description').value,
                amount: parseFloat(document.getElementById('amount').value),
                type: document.getElementById('type').value,
                date: document.getElementById('date').value
            };

            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            // Limpar formulário
            this.reset();
            document.getElementById('date').valueAsDate = new Date();

            // Atualizar interface
            updateBalance();
            renderTransactions();
        });

        // Função para deletar transação
        function deleteTransaction(id) {
            if (confirm('Deseja realmente excluir esta transação?')) {
                transactions = transactions.filter(t => t.id !== id);
                localStorage.setItem('transactions', JSON.stringify(transactions));
                updateBalance();
                renderTransactions();
            }
        }

        // Inicializar
        updateBalance();
        renderTransactions();
require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:statements) do
      primary_key :id
      Integer :first_monad
      Integer :last_monad

      index [:first_monad, :last_monad], unique: true
    end
  end
end

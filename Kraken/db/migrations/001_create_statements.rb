require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:statements) do
      primary_key :id
      Integer :first
      Integer :last

      index [:first, :last], unique: true
    end
  end
end

require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:sources) do
      primary_key :id
      Integer :book_id
      Integer :first, index: true
      Integer :last, index: true
      Integer :occurrence
      Integer :role_id
    end
  end
end

require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:sources) do
      primary_key :id
      Integer :first, index: true
      Integer :last, index: true
      Integer :occurrence
      Integer :role
    end
  end
end

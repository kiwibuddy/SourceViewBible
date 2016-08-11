require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:sphere_statements) do
      Integer :id, index: true
      Integer :word_count
      
      primary_key [:id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end

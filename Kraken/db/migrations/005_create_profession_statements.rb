require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:source_profession_statements) do
      Integer :profession_id, :index => true
      primary_key [:profession_id, :statement_id]
      foreign_key :statement_id, :statements
    end

    create_table(:recipient_profession_statements) do
      Integer :profession_id, :index => true
      primary_key [:profession_id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end

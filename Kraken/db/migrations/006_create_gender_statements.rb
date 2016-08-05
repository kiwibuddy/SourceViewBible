require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:source_gender_statements) do
      Integer :gender_id, index: true
      primary_key [:gender_id, :statement_id]
      foreign_key :statement_id, :statements
    end

    create_table(:recipient_gender_statements) do
      Integer :gender_id, index: true
      primary_key [:gender_id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end

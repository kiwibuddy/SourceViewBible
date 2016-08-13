require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:professions) do
      foreign_key :actant_id, :actants
      Integer :profession_id
      primary_key [:actant_id, :profession_id]
    end
  end
end

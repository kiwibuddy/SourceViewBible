require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:actant_professions) do
      Integer :id, index: true
      Integer :profession_id, index: true
      primary_key [:id, :profession_id]
    end
  end
end

require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:spheres) do
      foreign_key :bso_id, :bso, index: true
      Integer :sphere_id
      Integer :word_count
      primary_key [:bso_id, :sphere_id]
    end
  end
end

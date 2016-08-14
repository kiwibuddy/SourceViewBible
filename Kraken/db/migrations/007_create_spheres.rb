require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:spheres) do
      Integer :bso_id, index: true
      Integer :sphere_id
      Integer :count
      primary_key [:bso_id, :sphere_id]
    end
  end
end

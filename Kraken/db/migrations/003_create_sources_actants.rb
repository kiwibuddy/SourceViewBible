require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:source_actants) do
      primary_key :id
      foreign_key :actant_id, :actants
      foreign_key :source_id, :sources
      Integer :word_count
    end

    create_table(:recipient_actants) do
      primary_key :id
      foreign_key :actant_id, :actants
      foreign_key :source_id, :sources
      Integer :word_count
    end
  end
end

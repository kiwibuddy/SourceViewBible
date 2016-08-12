require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:source_actants) do
      primary_key :id
      foreign_key :actant_id, :actants
      foreign_key :source_id, :sources
      Integer :word_count
      Integer :family_count
      Integer :economics_count
      Integer :government_count
      Integer :religion_count
      Integer :education_count
      Integer :communication_count
      Integer :celebration_count
    end

    create_table(:recipient_actants) do
      primary_key :id
      foreign_key :actant_id, :actants
      foreign_key :source_id, :sources
      Integer :word_count
      Integer :family_count
      Integer :economics_count
      Integer :government_count
      Integer :religion_count
      Integer :education_count
      Integer :communication_count
      Integer :celebration_count
    end
  end
end

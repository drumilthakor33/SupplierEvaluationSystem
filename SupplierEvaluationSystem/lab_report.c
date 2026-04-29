#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE_LENGTH 256

int main() {
    FILE *file;
    char filename[] = "chemical_data.txt";
    char line[MAX_LINE_LENGTH];
    char chemical_name[100];
    double purity;
    double total_purity = 0.0;
    int count = 0;

    // Open the file for reading
    file = fopen(filename, "r");
    if (file == NULL) {
        printf("Error: Could not open file %s\n", filename);
        printf("Please ensure 'chemical_data.txt' exists in the same directory.\n");
        return 1;
    }

    printf("--- Lab Report: Chemical Purity ---\n");
    printf("%-20s | %s\n", "Chemical Name", "Purity (%)");
    printf("-----------------------------------\n");

    // Read data line by line
    while (fgets(line, sizeof(line), file)) {
        // Parse the line. Assuming format: ChemicalName PurityValue
        if (sscanf(line, "%99s %lf", chemical_name, &purity) == 2) {
            printf("%-20s | %.2f%%\n", chemical_name, purity);
            total_purity += purity;
            count++;
        }
    }

    // Close the file
    fclose(file);

    printf("-----------------------------------\n");
    // Calculate and print average purity
    if (count > 0) {
        double average_purity = total_purity / count;
        printf("Total samples: %d\n", count);
        printf("Average Purity: %.2f%%\n", average_purity);
    } else {
        printf("No valid data found in the file.\n");
    }

    return 0;
}

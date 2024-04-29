from zkpy.circuit import Circuit, GROTH, PLONK, FFLONK

# Define the circuit that checks if a string contains another string
circuit = Circuit("./contains_string.circom")
circuit.compile()

# Generate the witness (proof) for the statement "the string 'I love Python Programming' contains the string 'Python'"
circuit.gen_witness({"str": "I love Python Programming", "sub": "Python"})

# Set up the proving system using the PLONK scheme and the powers of tau file
circuit.setup(PLONK, ptau_file="ptau.ptau")

# Generate the zero-knowledge proof
circuit.prove(PLONK)

# Export the verification key and proof
circuit.export_vkey("vkey.json")
circuit.export_proof("proof.json", "public.json")

# Verify the proof
circuit.verify(PLONK, "vkey.json", "public.json", "proof.json")

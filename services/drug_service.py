def get_generic_alternatives(brand_name: str):
    """
    In production: Call Eka Care or 1mg API.
    For now: We return a placeholder list.
    """
    # Logic: Search DB for 'brand_name' -> Get salt/composition -> Find cheaper brands
    return [
        {"brand": "Generic Variant A", "price_diff": "-40%"},
        {"brand": "Generic Variant B", "price_diff": "-55%"}
    ]